/**
 * Nodejs Picture synthesis script
 * - npm init
 * - npm install images
 * - jpeg images support compression, png not
 */

// 1. kacopunk
//  1. 合约 - 丽婷
//  1. 确定稀有款等级与数量，设置全局随机性 - 多多、陈叔、丽婷
//  2. 设置售价 - 陈叔、丽婷
//  3. 会员身份，在kaco官网展示头像图片 - 丽婷
// 2. 图片合成 - 丽婷 or 小梦
// 3. JSON结构生成 - 包子，丽婷
// 4. JSON与图片存储服务在kasier网站上 - 丽婷
// 5. 联调 - 丽婷、小梦
// 6. 暂定 倒计时 11月12日早上10点开启销售 - 华子、小梦
const images = require("images");
const fs = require("fs");
const path = require("path");

const Backgrounds = [
  "Blue Ink Color",
  "Red Ink Color",
  "Green Thread",
  "Hazy Night",
  "Purple Aurora",
  "Purple Ripples",
  "Green Ripple",
  "Water Emulsion",
  "Yellow Aurora",
  "Cyan Aurora",
];

const Caps = [
  "Blue Light",
  "Knit Cap",
  "Searchlights",
  "Boy Scout",
  "Color Strip",
  "NEON light",
  "Pumpkins",
  "Pussycat",
  "Swimming Cap",
  "Waves",
  "Yellow Strip",
];
const Clothes = [
  "Cardigan-Dark Color",
  "Cardigan-Sparkly",
  "Artist",
  "Bathing Ring",
  "Blue Coat",
  "Flowered Dress",
  "Green Sweater",
  "Leisure",
  "Miners",
  "Musician",
  "Purple Sweater",
];
const Glasses = [
  "Miner’s Glasses",
  "Swimming Goggles",
  "Blotchy",
  "Fire Rod",
  "Flash",
  "Green Color",
  "Green Light",
  "Pastels",
  "Pixelation",
  "Purple Color",
  "Yellow Light",
];
// const Backgrounds = ["1", "2", "3"];
// const Caps = ["1", "2"];
// const Clothes = ["1", "2"];
// const Glasses = ["1", "2"];
const Header = ["Header"];
const arr = [Backgrounds, Clothes, Header, Caps, Glasses];
const types = [
  {
    hint: "背景",
    type: "Backgrounds",
    value: Backgrounds,
    x: 0,
    y: 0,
  },
  { hint: "衣服", type: "Clothes", value: Clothes, x: 400, y: 0 },
  { hint: "头轮廓", type: "Header", value: Header, x: 400, y: 0 },
  { hint: "帽子", type: "Caps", value: Caps, x: 400, y: 0 },
  { hint: "眼镜", type: "Glasses", value: Glasses, x: 400, y: 0 },
];
// img file
const inputPath = path.resolve(__dirname, "../img/");
const outputPath = path.resolve(__dirname, "../karsier/image/");
// 等级
// A = 2
// B = 16
// C = 64
// D = 2918
// i. 0 <= k < 2  稀有性 SSS
// ii. 2 <= k < 2+16  稀有性 SS  2^4
// iii. 2+16 <= k < 2+16+64  稀有性 S   2^3*8
// iiii. 2+16+64 <= k < 2+16+64+2918  稀有性 S   2^3*8
const SS = 2 + 16;
const S = 2 + 16 + 64;
const A = 2 + 16 + 64 + 2918;

let kk = 1;
function run() {
  let results: any = [];
  let result: any = [];
  function doExchange(arr: any, depth: any) {
    for (let i = 0; i < arr[depth].length; i++) {
      result[depth] = arr[depth][i];
      if (depth != arr.length - 1) {
        doExchange(arr, depth + 1);
      } else {
        results.push(result.join("|"));
      }
    }
  }
  doExchange(arr, 0);

  // wirte result to file

  let resultsArr = [];
  let a = 0;
  let b = 4000;
  let c = 8000;
  for (let j = 1; j <= results.length; j++) {
    let i = j - 1;
    let instance = results[i].split("|");
    let instanceNum = [
      Backgrounds.indexOf(instance[0]) + 1,
      Clothes.indexOf(instance[1]) + 1,
      Caps.indexOf(instance[3]) + 1,
      Glasses.indexOf(instance[4]) + 1,
    ];
    if (instanceNum.filter((v: number) => v > 2).length === 0) {
      resultsArr.push({
        key: a,
        value: results[i],
      });
      a++;
    } else if (
      instanceNum.slice(1, 4).filter((v: number) => v < 3).length === 3
    ) {
      resultsArr.push({
        key: b,
        value: results[i],
      });
      b++;
    } else if (instanceNum.filter((v: number) => v < 3).length === 0) {
      resultsArr.push({
        key: c,
        value: results[i],
      });
      c++;
    }
  }
  const resultsArrS = resultsArr.sort((a, b) => a.key - b.key);

  fs.writeFile(
    path.resolve(__dirname, "../db/results.json"),
    JSON.stringify(resultsArrS.map((v) => v.value).slice(0, 3000 - 2)),
    function (err: any) {
      if (err) {
        throw err;
      }
    }
  );
  // compare img
  let db: any = {};
  // 3000
  for (let j = 1; j < resultsArr.length; j++) {
    kk++;
    let i = j - 1;
    let attributes: any = [];
    let instance = resultsArr[i]["value"].split("|");
    // i. 0 <= k < 2  稀有性 SSS
    // ii. 2 <= k < 2+16  稀有性 SS  2^4
    // iii. 2+16 <= k < 2+16+64  稀有性 S   2^3*8
    // iiii. 2+16+64 <= k < 2+16+64+2918  稀有性 S   2^3*8
    if (kk >= 0 && kk < 1500) {
      // if (kk >= 1000 && kk < 2000) {
      // if (kk >= 2000 && kk < 3000) {
      let robatInstance = images(
        `${inputPath}/${types[0].type}/${instance[0]}.png`
      )
        .size(1600)
        .draw(images(`${inputPath}/${types[1].type}/${instance[1]}.png`), 0, 0)
        .draw(images(`${inputPath}/${types[2].type}/${instance[2]}.png`), 0, 0)
        .draw(images(`${inputPath}/${types[3].type}/${instance[3]}.png`), 0, 0)
        .draw(images(`${inputPath}/${types[4].type}/${instance[4]}.png`), 0, 0)
        .save(`${outputPath}/${kk}.jpeg`, {
          quality: 80,
        });
      for (let k = 0; k < types.length; k++) {
        if (k === 0) {
          attributes = [
            {
              trait_type: types[k].type,
              value: instance[k],
            },
          ];
        } else {
          attributes.push({
            trait_type: types[k].type,
            value: instance[k],
          });
        }
      }
      db[kk] = {
        name: `Karsier #${kk}`,
        description:
          "Karsier came to the blockchain world to create some fun for us.",
        image: `https://karsier.kaco.finance/karsier/image/${kk}.jpeg`,
        attributes: attributes,
      };
      fs.writeFile(
        path.resolve(__dirname, `../karsier/${kk}.json`),
        JSON.stringify(db[kk]),
        function (err: any) {
          if (err) {
            throw err;
          }
        }
      );
      console.log(kk);
      // robatInstance = undefined;
    }
  }
  fs.writeFile(
    path.resolve(__dirname, "../db/config.json"),
    JSON.stringify(db),
    function (err: any) {
      if (err) {
        throw err;
      }
    }
  );
}

run();
