import Setting from '../models/Setting.js';

/**
 * GET /api/settings
 * Get the global settings (public).
 */
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne().lean();
    if (!settings) {
      const newSettings = await Setting.create({});
      settings = newSettings.toObject();
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/settings
 * Update global settings (protected).
 */
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    const { heroTitle, heroSubtitle, heroDescription, heroImage, heroImagePublicId } = req.body;
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (heroDescription !== undefined) settings.heroDescription = heroDescription;
    if (heroImage !== undefined) settings.heroImage = heroImage;
    if (heroImagePublicId !== undefined) settings.heroImagePublicId = heroImagePublicId;

    await settings.save();

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
