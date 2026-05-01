import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
} from "@capacitor-community/admob";

const TOP_BANNER_ID = "ca-app-pub-5626161990859268/8223329318";

export async function initAds(): Promise<void> {
  if (!window.Capacitor) return;
  try {
    await AdMob.initialize();
  } catch (e) {
    console.warn("AdMob init failed:", e);
  }
}

export async function showBannerAds(): Promise<void> {
  if (!window.Capacitor) return;
  try {
    const options: BannerAdOptions = {
      adId: TOP_BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER, // changed from BANNER
      position: BannerAdPosition.TOP_CENTER,
      margin: 0,
      isTesting: false,
    };
    await AdMob.showBanner(options);
  } catch (e) {
    console.warn("AdMob showBanner failed:", e);
  }
}

export async function hideBannerAds(): Promise<void> {
  if (!window.Capacitor) return;
  try {
    await AdMob.removeBanner();
  } catch (e) {
    console.warn("AdMob removeBanner failed:", e);
  }
}
