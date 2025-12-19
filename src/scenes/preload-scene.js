// elementos visuais
import {
  BATTLE_ASSET_KEYS,
  BATTLE_BACKGROUND_ASSET_KEYS,
  CHARACTERS_ASSET_KEYS,
  HEALTH_BAR_ASSET_KEYS,
  UI_ASSET_KEYS,
} from "../assets/asset-key.js";
import Phaser from "../lib/phaser.js";
import { SCENE_KEYS } from "./scenes-key.js";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD_SCENE });
    console.log(SCENE_KEYS.PRELOAD_SCENE);
  }

  preload() {
    console.log(`[${PreloadScene.name}: preload] invoked`);

    const characterswAssetPath = "assets/images/characters";
    const kenneysAssetPath = "assets/images/kenneys-assets";

    //battle backgrounds

    this.load.image(
      BATTLE_BACKGROUND_ASSET_KEYS.FOREST,
      `${characterswAssetPath}/battle-backgrounds/forest-background.png`
    );

    //battle assets
    this.load.image(
      BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,
      `${kenneysAssetPath}/ui-space-expansion/custom-ui.png`
    );

    //health bar assets
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.RIGHT_CAP,
      `${kenneysAssetPath}/ui-space-expansion/barHorizontal_blue_right.png`
    );

    this.load.image(
      HEALTH_BAR_ASSET_KEYS.MIDDLE,
      `${kenneysAssetPath}/ui-space-expansion/barHorizontal_blue_mid.png`
    );

    this.load.image(
      HEALTH_BAR_ASSET_KEYS.LEFT_CAP,
      `${kenneysAssetPath}/ui-space-expansion/barHorizontal_blue_left.png`
    );

    //characters assets
    this.load.spritesheet(
      CHARACTERS_ASSET_KEYS.FARADAY,
      `${characterswAssetPath}/charactersw/FireWizard/Idle.png`,
      { frameWidth: 128, frameHeight: 128 }
    );

    this.load.spritesheet(
      CHARACTERS_ASSET_KEYS.CURIE,
      `${characterswAssetPath}/charactersw/Kunoichi/Idle.png`,
      { frameWidth: 128, frameHeight: 128 }
    );

    // UI ASSETS
    this.load.image(
      UI_ASSET_KEYS.CURSOR,
      `${characterswAssetPath}/ui/cursor.png`,
  
    );

  }
  create() {
    console.log(`[${PreloadScene.name}: create] invoked`);
    this.scene.start(SCENE_KEYS.BATTLE_SCENE);
  }
}
