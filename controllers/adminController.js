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
