import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  RewardAdOptions,
  RewardAdPluginEvents,
} from "@capacitor-community/admob";

const TOP_BANNER_ID = "ca-app-pub-5626161990859268/8223329318";
const REWARDED_AD_ID = "ca-app-pub-5626161990859268/9051438634";

export async function initAds(): Promise<void> {
  if (!window.Capacitor) return;
  try {
    await AdMob.initialize();

    // Re-show banner if it fails to load on refresh
    AdMob.addListener(BannerAdPluginEvents.FailedToLoad, () => {
      setTimeout(() => showBannerAds(), 5000); // retry after 5s
    });
  } catch (e) {
    console.warn("AdMob init failed:", e);
  }
}

export async function showBannerAds(): Promise<void> {
  if (!window.Capacitor) return;
  try {
    const options: BannerAdOptions = {
      adId: TOP_BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
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

// Returns true if the user watched the ad and earned the reward, false otherwise.
export async function showRewardedAd(): Promise<boolean> {
  if (!window.Capacitor) return false;
  return new Promise(async (resolve) => {
    let rewarded = false;
    let settled = false;
    let rewardListener: any;
    let dismissListener: any;
    let failListener: any;

    // Single exit point: remove all listeners and resolve exactly once.
    // Without this, an ad that fails to show (no Dismissed event) would
    // leak all listeners and leave the promise pending forever.
    const settle = (result: boolean) => {
      if (settled) return;
      settled = true;
      rewardListener?.remove();
      dismissListener?.remove();
      failListener?.remove();
      resolve(result);
    };

    try {
      // Set reward flag when user earns reward (watched enough of the ad)
      rewardListener = await AdMob.addListener(
        RewardAdPluginEvents.Rewarded,
        () => {
          rewarded = true;
        },
      );

      // Resolve only when the ad is fully dismissed so UI state is restored correctly
      dismissListener = await AdMob.addListener(
        RewardAdPluginEvents.Dismissed,
        () => {
          settle(rewarded);
        },
      );

      // If the ad fails to show, Dismissed never fires — settle here instead
      failListener = await AdMob.addListener(
        RewardAdPluginEvents.FailedToShow,
        () => {
          settle(false);
        },
      );

      const options: RewardAdOptions = {
        adId: REWARDED_AD_ID,
        isTesting: false,
      };

      await AdMob.prepareRewardVideoAd(options);
      await AdMob.showRewardVideoAd();
    } catch (e) {
      console.warn("AdMob rewarded ad failed:", e);
      settle(false);
    }
  });
}
