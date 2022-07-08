kaboom({
  fullscreen: true,
  clearColor: [0.2, 7.1, 3, 1],
  global: true,
  scale: 2,
});
loadRoot("./sprites/");
loadSprite("ground", "block.png");
loadSprite("mario", "mario.png");
loadSprite("coin", "coin.png");
loadSprite("unboxed", "unboxed.png", "unboxed");
loadSprite("surprise", "surprise.png", "coin-surprise");
loadSprite("surprise", "surprise.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("loop", "loop.png");
loadSprite("d", "dino.png");
loadSprite("mushroom", "mushroom.png", "mushroom");
loadSprite("princes", "princes.png");
loadSprite("image", "z - Copy.png");
loadSprite("evil", "evil_mushroom.png");

loadSound("jump", "jumpSound.mp3");
loadSound("song", "gameSound.mp3");

let score = 0;

scene("game", () => {
  play("song");
  layers(["bg", "obj", "ui"], "obj");
  const mapMajd = [
    "=                                                                                                                                                                                                                    ",
    "=                                                                                                                                                                                                                    ",
    "=                                                                                                                                                                                                                    ",
    "=                                                                                                                                                                                                                   ",
    "=                                                                                                                                                                                                                   ",
    "=                       l                   l                   l                      l                       l                          l                                l                         l                       ",
    "=                                                                                                                                                                                                                   ",
    "=                                                                                                                                                                                                                    ",
    "=                                                                                                                                                                                                                    ",
    "=                                                                                                                                                                                                                    ",
    "=                                                                                                                                                                                                                    ",
    "=                                                                                                                                                                                                                    ",
    "=                                                    $                                       $$$$$                                                                                                                         ",
    "=                                     $ $      =====!====                      ==========?==!====?========      $$                                  $                                                                     ",
    "=                                                                                                                                                                                                                    ",
    "=                                    !vvv?vvvv                     d     $                                                 =============                    ==========     ========           =                                             ",
    "=                                                                ====   $  v     == =      $$$$$$$$                                   $$$$$$                              d                   =                                  ",
    "=             ==           q                                 ==                                                       === =                        =====               ========       ==========     p                                                  ",
    "=                a     a                             = ===              d                  d                                      d                                                    d                                       ",
    "==================================================  == ========== ====== ==============================    = ==================================                         ==============================                                                 ",
    "                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                    ",
    "                                                                                                                                                                                                                    ",
  ];
  const mapM = {
    width: 20,
    height: 20,
    "=": [sprite("ground"), solid(), "block"],
    $: [sprite("coin"), "coins"],
    v: [sprite("unboxed"), solid(), "unboxed"],
    "?": [sprite("surprise"), solid(), "coin-surprise"],
    q: [sprite("surprise"), solid(), "princes"],
    "!": [sprite("surprise"), solid(), "mash"],
    p: [sprite("pipe"), solid(), "pipe"],
    l: [sprite("loop"), solid()],
    d: [sprite("d"), solid()],
    m: [sprite("mushroom"), solid(), body(), "mushroom"],
    a: [sprite("evil"), solid(), body(), "evil-mushroom"],
    o: [sprite("princes"), solid(), "princes"],
  };

  const gameLevel = addLevel(mapMajd, mapM);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scoreLabel = add([text("score: " + score)]);

  add([
    sprite("image"),
    layer("bg"),
    pos(height() / 2, width() / 2),
    scale(3),
    origin("center"),
  ]);

  keyDown("right", () => {
    player.move(190, 0);
  });
  keyDown("left", () => {
    player.move(-190, 0);
  });
  keyDown("up", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(400);
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin-surprise")) {
      destroy(obj);
      gameLevel.spawn("v", obj.gridPos);
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
    }

    if (obj.is("mash")) {
      destroy(obj);
      gameLevel.spawn("v", obj.gridPos);
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
    if (obj.is("princes")) {
      destroy(obj);
      gameLevel.spawn("v", obj.gridPos);
      gameLevel.spawn("o", obj.gridPos.sub(0, 1));
    }
    if (obj.is("block")) {
      destroy(obj);
    }
  });

  action("mushroom", (obj) => {
    obj.move(40, 0);
  });

  player.collides("coins", (obj) => {
    score += 5;
    destroy(obj);
  });
  player.collides("mushroom", (obj) => {
    destroy(obj);
    player.biggify(15);
  });
  player.collides("pipe", (obj) => {
    keyDown("down", () => {
      go("win");
    });
  });
  const FuLL_DOWN = 700;

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "score: " + score;
    if (player.pos.y >= FuLL_DOWN) {
      go("lose");
    }
  });
  action("evil-mushroom", (obj) => {
    obj.move(50, 0);
  });

  let isJumping = false;

  player.collides("evil-mushroom", (obj) => {
    if (isJumping) {
      destroy(obj);
    } else {
      destroy(player);
      go("lose");
    }
  });

  player.action(() => {
    isJumping = !player.grounded();
  });

  // scene end
});

start("game");
//scene   2
scene("lose", () => {
  add([
    text("Game Over\n Try Again", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  add([
    text("press spase to play again"),
    origin("center"),
    pos(width() / 2, height() / 2 + 200),
  ]);
  keyDown("space", () => {
    go("game");
  });
});
scene("win", () => {
  add([text("Great", 70), origin("center"), pos(width() / 2, height() / 2)]);
});

// lose scene end
