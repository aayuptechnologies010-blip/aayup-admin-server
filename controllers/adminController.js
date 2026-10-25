const { supabase } = require('../config/db');

exports.createSuperAdmin = async (req, res) => {
  try {
    const { email, password, fullName, secretKey } = req.body;

    // Secure verification
    if (secretKey !== process.env.SUPABASE_SERVICE_ROLE_KEY && secretKey !== 'Aayup@SuperAdmin2026#') {
      return res.status(403).json({ error: 'Unauthorized: Invalid secret key' });
    }

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Attempt creation with admin API
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || 'Super Administrator',
        role: 'superadmin',
      },
    });

    if (createError) {
      return res.status(400).json({ error: createError.message });
    }

    res.json({
      success: true,
      message: 'SuperAdmin account provisioned successfully',
      user: { id: newUser.user.id, email: newUser.user.email },
    });
  } catch (error) {
    console.error('SuperAdmin creation error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.saveDynamicData = async (req, res) => {
  try {
    const { key, data } = req.body;
    if (!key || data === undefined) {
      return res.status(400).json({ error: 'Key and data are required' });
    }

    const FILE_MAP = {
      aayup_dynamic_team_members: 'team_members.json',
      aayup_dynamic_blog_posts: 'blog_posts.json',
      aayup_dynamic_portfolio_projects: 'portfolio_projects.json',
      aayup_dynamic_faqs: 'faqs.json',
      aayup_dynamic_announcement: 'announcements.json',
    };

    const fileName = FILE_MAP[key] || `${key}.json`;
    const buffer = Buffer.from(JSON.stringify(data, null, 2));

    const { error } = await supabase.storage
      .from('Aayup')
      .upload(`site-data/${fileName}`, buffer, {
        contentType: 'application/json',
        upsert: true,
      });

    if (error) {
      console.error('[AdminAPI] Storage upload error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, message: `Successfully updated ${fileName}` });
  } catch (error) {
    console.error('[AdminAPI] saveDynamicData error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDynamicData = async (req, res) => {
  try {
    const { key } = req.params;
    const FILE_MAP = {
      aayup_dynamic_team_members: 'team_members.json',
      aayup_dynamic_blog_posts: 'blog_posts.json',
      aayup_dynamic_portfolio_projects: 'portfolio_projects.json',
      aayup_dynamic_faqs: 'faqs.json',
      aayup_dynamic_announcement: 'announcements.json',
    };

    const fileName = FILE_MAP[key] || `${key}.json`;
    const { data: publicUrlData } = supabase.storage
      .from('Aayup')
      .getPublicUrl(`site-data/${fileName}`);

    if (!publicUrlData?.publicUrl) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fetchRes = await fetch(`${publicUrlData.publicUrl}?t=${Date.now()}`);
    if (!fetchRes.ok) {
      return res.status(404).json({ error: 'Data not found in storage' });
    }

    const jsonData = await fetchRes.json();
    res.json({ success: true, data: jsonData });
  } catch (error) {
    console.error('[AdminAPI] getDynamicData error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const file = req.file;
    const path = require('path');
    const fs = require('fs');
    const ext = path.extname(file.originalname) || '.png';
    const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // 1. Save to local uploads folder
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const localFilePath = path.join(uploadsDir, cleanName);
    fs.writeFileSync(localFilePath, file.buffer);

    // 2. Also upload to Supabase storage 'Aayup/uploads/' for resilient CDN delivery
    let cdnUrl = '';
    try {
      const { data: storageUpload, error: storageErr } = await supabase.storage
        .from('Aayup')
        .upload(`uploads/${cleanName}`, file.buffer, {
          contentType: file.mimetype || 'image/png',
          upsert: true,
        });

      if (!storageErr) {
        const { data: publicUrlData } = supabase.storage
          .from('Aayup')
          .getPublicUrl(`uploads/${cleanName}`);
        if (publicUrlData?.publicUrl) {
          cdnUrl = publicUrlData.publicUrl;
        }
      }
    } catch (cdnErr) {
      console.warn('[uploadMedia] Supabase mirror warning:', cdnErr);
    }

    // Determine host for local backend link
    const protocol = req.protocol || 'https';
    const host = req.get('host') || 'api.aayuptechnologies.com';
    const localUrl = `${protocol}://${host}/uploads/${cleanName}`;

    // Prefer CDN URL if generated, or fallback to backend uploads URL
    const fileUrl = cdnUrl || localUrl;

    res.json({
      success: true,
      url: fileUrl,
      localUrl,
      cdnUrl,
      fileName: cleanName,
      message: 'Image uploaded successfully to server',
    });
  } catch (error) {
    console.error('[AdminAPI] uploadMedia error:', error);
    res.status(500).json({ error: error.message });
  }
};

