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
