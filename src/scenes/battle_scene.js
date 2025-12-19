// lógica visual
import {
  BATTLE_ASSET_KEYS,
  BATTLE_BACKGROUND_ASSET_KEYS,
  CHARACTERS_ASSET_KEYS,
  HEALTH_BAR_ASSET_KEYS,
} from "../assets/asset-key.js";
import { BattleMenu } from "../battle/ui/menu/battle-menu.js";
import { DIRECTION } from "../common/direction.js";
import Phaser from "../lib/phaser.js";
import { SCENE_KEYS } from "./scenes-key.js";

export class BattleScene extends Phaser.Scene {
  /** @type {BattleMenu} */
  #battleMenu;
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys}*/
  #cursorKeys;
  constructor() {
    super({
      key: SCENE_KEYS.BATTLE_SCENE,
    });
    console.log(SCENE_KEYS.BATTLE_SCENE);
  }

  create() {
    console.log(`[${BattleScene.name}: create] invoked`);
    // create main background
    this.add.image(0, 0, BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setOrigin(0);

    // render out player and npc

    this.anims.create({
      key: "fire_wizard_idle",
      frames: this.anims.generateFrameNumbers(CHARACTERS_ASSET_KEYS.FARADAY, {
        start: 0,
        end: 6,
      }),
      frameRate: 8, // Velocidade de reprodução (8 frames por segundo)
      repeat: -1, // Repetição infinita
    });

    // 3B. Adicionar o sprite à cena
    const fireWizardSprite = this.add.sprite(
      790,
      40,
      CHARACTERS_ASSET_KEYS.FARADAY
    );

    fireWizardSprite.setScale(4.5);

    // 3C. Iniciar a animação
    fireWizardSprite.play("fire_wizard_idle");

    //  Curie
    this.anims.create({
      key: "kunoichi_idle",
      frames: this.anims.generateFrameNumbers(CHARACTERS_ASSET_KEYS.CURIE, {
        start: 0,
        end: 7,
      }), // Exemplo: frames 0 a 5
      frameRate: 8, // Velocidade de reprodução (8 frames por segundo)
      repeat: -1, // Repetição infinita
    });

    // 3B. Adicionar o sprite à cena
    const kunoichiSprite = this.add.sprite(
      230,
      160,
      CHARACTERS_ASSET_KEYS.CURIE
    );

    kunoichiSprite.setScale(4.5);

    // 3C. Iniciar a animação
    kunoichiSprite.play("kunoichi_idle");

    // information bar
    const playerPersonName = this.add.text(
      30,
      20,
      CHARACTERS_ASSET_KEYS.FARADAY,
      {
        color: "#2f1717ff",
        fontSize: "32px",
        fontStyle: "bold",
      }
    );
    this.add.container(556, 318, [
      this.add
        .image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND)
        .setOrigin(0),
      playerPersonName,
      this.#createInformation(34, 34),
      this.add.text(playerPersonName.width + 50, 26.5, "Arcanista", {
        color: "#3f1345ff",
        fontSize: "20px",
        fontStyle: "bold",
      }),
      this.add.text(30, 55, "FC", {
        color: "#a74406ff",
        fontSize: "24px",
        fontStyle: "Bold italic",
      }),
      this.add
        .text(180, 80, "Força de Campo", {
          color: "#a74406ff",
          fontSize: "13px",
          fontStyle: "bold",
        })
        .setOrigin(1, 0),

      this.add
        .text(430, 80, "100/100", {
          color: "#a74406ff",
          fontSize: "16px",
          fontStyle: "bold",
        })
        .setOrigin(1, 0),
    ]);

    const enemyPersonName = this.add.text(30, 20, CHARACTERS_ASSET_KEYS.CURIE, {
      color: "#2f1717ff",
      fontSize: "32px",
      fontStyle: "bold",
    });
    this.add.container(0, 0, [
      this.add
        .image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND)
        .setOrigin(0)
        .setScale(1, 0.8),

      enemyPersonName,
      this.#createInformation(34, 34),
      this.add.text(enemyPersonName.width + 50, 26.5, "Alquimista", {
        color: "#3f1345ff",
        fontSize: "20px",
        fontStyle: "bold",
      }),
      this.add.text(30, 55, "FA", {
        color: "#a74406ff",
        fontSize: "24px",
        fontStyle: "Bold italic",
      }),
    ]);
    // main info and sub
    this.#battleMenu = new BattleMenu(this);
    this.#battleMenu.showMainBattleMenu();

    this.#cursorKeys = this.input.keyboard.createCursorKeys();
  }

  update() {
    const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(
      this.#cursorKeys.space
    );
    if (wasSpaceKeyPressed) {
      this.#battleMenu.handlePlayerInput("OK");
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift)) {
      this.#battleMenu.handlePlayerInput("CANCELAR");
      return;
    }
    /** @type {DIRECTION} */

    let selectedDirection = DIRECTION.NENHUM;
    if (this.#cursorKeys.left.isDown) {
      selectedDirection = DIRECTION.ESQUERDA;
    } else if (this.#cursorKeys.right.isDown) {
      selectedDirection = DIRECTION.DIREITA;
    } else if (this.#cursorKeys.up.isDown) {
      selectedDirection = DIRECTION.CIMA;
    } else if (this.#cursorKeys.down.isDown) {
      selectedDirection = DIRECTION.BAIXO;
    }

    if (selectedDirection != DIRECTION.NENHUM) {
      this.#battleMenu.handlePlayerInput(selectedDirection);
    }
  }
  /**
   *
   * @param {number} x the x position to place the informstion bar container
   * @param {number} y the y position to place the information bar container
   * @returns {Phaser.GameObjects.Container}
   */
  #createInformation(x, y) {
    const scaleY = 0.7;
    const leftCap = this.add
      .image(x, y, HEALTH_BAR_ASSET_KEYS.LEFT_CAP)
      .setOrigin(0, 0.5)
      .setScale(1, scaleY);
    const middle = this.add
      .image(leftCap.x + leftCap.width, y, HEALTH_BAR_ASSET_KEYS.MIDDLE)
      .setOrigin(0, 0.5)
      .setScale(1, scaleY);
    middle.displayWidth = 360;
    const rightCap = this.add
      .image(middle.x + middle.displayWidth, y, HEALTH_BAR_ASSET_KEYS.RIGHT_CAP)
      .setOrigin(0, 0.5)
      .setScale(1, scaleY);
    return this.add.container(x, y, [leftCap, middle, rightCap]);
  }
}
function setScale(arg0, scaleY) {
  throw new Error("Function not implemented.");
}
