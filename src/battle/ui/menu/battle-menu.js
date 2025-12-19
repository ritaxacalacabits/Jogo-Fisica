// gerindo a navegação do utilizador
import Phaserfrom from "../../../lib/phaser.js";
import {
  CHARACTERS_ASSET_KEYS,
  UI_ASSET_KEYS,
} from "../../../assets/asset-key.js";
import { DIRECTION } from "../../../common/direction.js";
import { exhaustiveGuard } from "../../../utils/guard.js";

/**
 * @typedef {keyof typeof BATTLE_MENU_OPTIONS} BattleMenuOptions
 */

/** @enum{BattleMenuOptions} */
const BATTLE_MENU_OPTIONS = Object.freeze({
  LUTAR: "LUTAR",
  FRAQUEZA: "FRAQUEZA",
  ITEM: "ITEM",
  DESISTIR: "DESISTIR",
});

/**
 * @typedef {keyof typeof ATTACK_MOVE_OPTIONS} AttackMoveOptions
 */

/** @enum{AttackMoveOptions} */

const ATTACK_MOVE_OPTIONS = Object.freeze({
  MOVE_1: "MOVE_1",
  MOVE_2: "MOVE_2",
  MOVE_3: "MOVE_3",
  MOVE_4: "MOVE_4",
});

const battleUiTextStyle = {
  color: "black",
  fontSize: "30px",
  fontStyle: "bold",
};

const BATTLE_MENU_CURSOR_POS = Object.freeze({
  x: 42,
  y: 38 ,
});

const ATTACK_MENU_CURSOR_POS = Object.freeze({
  x: 42,
  y: 86,
});

export class BattleMenu {
  /**@type {Phaser.Scene}*/
  #scene;
  /**@type {Phaser.GameObjects.Container}*/
  #mainBattleMenuPhaserContainerGameObject;
  /**@type {Phaser.GameObjects.Container}*/
  #moveSelectionSubBattleMenuPhaserContainerGameObject;
  /**@type {Phaser.GameObjects.Text}*/
  #battleTextGameObjectLine1;
  /**@type {Phaser.GameObjects.Text}*/
  #battleTextGameObjectLine2;
  /**@type {Phaser.GameObjects.Image}*/
  #mainBattleMenuCursorPhaserImageGameObject;
  /**@type {Phaser.GameObjects.Image}*/
  #attackBattleMenuCursorPhaserImageGameObject;
  /**@type {BattleMenuOptions}*/
  #selectedBattleMenuOption;
  /**@type {AttackMoveOptions}*/
  #selectedAttackMenuOption;
  /**
   *
   * @param {Phaser.Scene} scene the Phaser 4 scene the battle menu will be added to
   */
  constructor(scene) {
    this.#scene = scene;
    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.LUTAR;
    this.#selectedAttackMenuOption = ATTACK_MOVE_OPTIONS.MOVE_1;
    this.#scene.add.bitmapText;
    this.#createMainInfoPane();
    this.#createMainBattleMenu();
    this.#createPersonAttackSubMenu();
  }

  showMainBattleMenu() {
    this.#battleTextGameObjectLine1.setText("Decida. O que");
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(1);
    this.#battleTextGameObjectLine1.setAlpha(1);
    this.#battleTextGameObjectLine2.setAlpha(1);

    this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.LUTAR;
    this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
      BATTLE_MENU_CURSOR_POS.x,
      BATTLE_MENU_CURSOR_POS.y
      
    );
  }

  hideMainBattleMenu() {
    this.#mainBattleMenuPhaserContainerGameObject.setAlpha(0);
    this.#battleTextGameObjectLine1.setAlpha(0);
    this.#battleTextGameObjectLine2.setAlpha(0);
  }

  showPersonAttackSubMenu() {
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(1);
  }

  hidePersonAttackSubMenu() {
    this.#moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(0);
  }
  /**
   *
   * @param {DIRECTION|'OK' |'CANCELAR'} input
   */
  handlePlayerInput(input) {
    console.log(input);
    if (input === "CANCELAR") {
      this.hidePersonAttackSubMenu();
      this.showMainBattleMenu();
      return;
    }
    if (input === "OK") {
      this.hideMainBattleMenu();
      this.showPersonAttackSubMenu();
      return;
    }

    this.#updateSelectedBattleMenuOptionFromInput(input);
    this.#moveMainBattleMenuCursor();
  
    
  }

  #createMainBattleMenu() {
    this.#battleTextGameObjectLine1 = this.#scene.add.text(
      20,
      468,
      "Decida. O que",
      battleUiTextStyle
    );
    // TO DO: usar data que passou pela class instance
    this.#battleTextGameObjectLine2 = this.#scene.add.text(
      20,
      512,
      `${CHARACTERS_ASSET_KEYS.FARADAY} DEVE FAZER? `,
      battleUiTextStyle
    );

    this.#mainBattleMenuCursorPhaserImageGameObject = this.#scene.add
      .image(
        BATTLE_MENU_CURSOR_POS.x,
        BATTLE_MENU_CURSOR_POS.y,
        UI_ASSET_KEYS.CURSOR,
        0
      )
      .setOrigin(0.5)
      .setScale(2.0);

    this.#mainBattleMenuPhaserContainerGameObject = this.#scene.add.container(
      520,
      448,
      [
        this.#createMainInforSubPane(),
        this.#scene.add.text(
          55,
          22,
          BATTLE_MENU_OPTIONS.LUTAR,
          battleUiTextStyle
        ),
        this.#scene.add.text(
          240,
          22,
          BATTLE_MENU_OPTIONS.FRAQUEZA,
          battleUiTextStyle
        ),
        this.#scene.add.text(
          55,
          70,
          BATTLE_MENU_OPTIONS.ITEM,
          battleUiTextStyle
        ),
        this.#scene.add.text(
          240,
          70,
          BATTLE_MENU_OPTIONS.DESISTIR,
          battleUiTextStyle
        ),
        this.#mainBattleMenuCursorPhaserImageGameObject,
      ]
    );
    this.hideMainBattleMenu();
  }

  #createPersonAttackSubMenu() {
    this.#attackBattleMenuCursorPhaserImageGameObject = this.#scene.add
      .image(
        ATTACK_MENU_CURSOR_POS.x,
        ATTACK_MENU_CURSOR_POS.y,
        UI_ASSET_KEYS.CURSOR,
        0
      )
      .setOrigin(0.5)
      .setScale(2.5);

    this.#moveSelectionSubBattleMenuPhaserContainerGameObject =
      this.#scene.add.container(0, 448, [
        this.#scene.add.text(55, 22, "ATRAIR", battleUiTextStyle),
        this.#scene.add.text(240, 22, "REPELIR", battleUiTextStyle),
        this.#scene.add.text(55, 70, "INDUZIR", battleUiTextStyle),
        this.#scene.add.text(240, 70, "DESCARGA", battleUiTextStyle),
      ]);

    this.hidePersonAttackSubMenu();
  }

  #createMainInfoPane() {
    const padding = 4;
    const rectHeight = 140;

    this.#scene.add
      .rectangle(
        padding,
        this.#scene.scale.height - rectHeight - padding,
        this.#scene.scale.width - padding * 2,
        rectHeight,
        0xede4f3,
        1
      )
      .setOrigin(0)
      .setStrokeStyle(8, 0x3f1345, 1);
  }

  #createMainInforSubPane() {
    const padding = 4;
    const rectWidth = 500;
    const rectHeight = 140;

    return this.#scene.add
      .rectangle(
        this.#scene.scale.height - rectHeight - padding,
        this.#scene.scale.width - padding * 2,
        rectHeight,
        0xede4f3,
        1
      )
      .setOrigin(0)
      .setStrokeStyle(8, 0x3f1345, 1);
  }

  /**
   *
   * @param {DIRECTION} direction
   */

  #updateSelectedBattleMenuOptionFromInput(direction) {
    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.LUTAR) {
      switch (direction) {
        case DIRECTION.DIREITA:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FRAQUEZA;
          return;
        case DIRECTION.BAIXO:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
          return;
        case DIRECTION.ESQUERDA:
        case DIRECTION.CIMA:
        case DIRECTION.NENHUM:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.FRAQUEZA) {
      switch (direction) {
        case DIRECTION.ESQUERDA:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.LUTAR;
          return;
        case DIRECTION.BAIXO:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.DESISTIR;
          return;
        case DIRECTION.DIREITA:
        case DIRECTION.CIMA:
        case DIRECTION.NENHUM:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.ITEM) {
      switch (direction) {
        case DIRECTION.DIREITA:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.DESISTIR;
          return;
        case DIRECTION.CIMA:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.LUTAR;
          return;
        case DIRECTION.ESQUERDA:
        case DIRECTION.BAIXO:
        case DIRECTION.NENHUM:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }

    if (this.#selectedBattleMenuOption === BATTLE_MENU_OPTIONS.DESISTIR) {
      switch (direction) {
        case DIRECTION.ESQUERDA:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.ITEM;
          return;
        case DIRECTION.CIMA:
          this.#selectedBattleMenuOption = BATTLE_MENU_OPTIONS.FRAQUEZA;
          return;
        case DIRECTION.DIREITA:
        case DIRECTION.BAIXO:
        case DIRECTION.NENHUM:
          return;
        default:
          exhaustiveGuard(direction);
      }
      return;
    }
    exhaustiveGuard(this.#selectedBattleMenuOption);
  }

  #moveMainBattleMenuCursor() {
    switch (this.#selectedBattleMenuOption) {
      case BATTLE_MENU_OPTIONS.LUTAR:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
          BATTLE_MENU_CURSOR_POS.x,
          BATTLE_MENU_CURSOR_POS.y
        );
        return;
      case BATTLE_MENU_OPTIONS.FRAQUEZA:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
          228,
          BATTLE_MENU_CURSOR_POS.y
        );
        return;
      case BATTLE_MENU_OPTIONS.ITEM:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(
          BATTLE_MENU_CURSOR_POS.x,
          86
        );

        return;
      case BATTLE_MENU_OPTIONS.DESISTIR:
        this.#mainBattleMenuCursorPhaserImageGameObject.setPosition(228, 86);

        return;
      default:
        exhaustiveGuard(this.#selectedBattleMenuOption);
    }
  }
}
  
