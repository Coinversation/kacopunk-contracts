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

const Backgrounds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const Caps = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
const Clothes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
const Glasses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
// const Backgrounds = ["1", "2", "3"];
// const Caps = ["1", "2"];
// const Clothes = ["1", "2"];
// const Glasses = ["1", "2"];
const Header = ["1"];
const arr = [Backgrounds, Header, Glasses, Caps, Clothes];
const types = [
  {
    hint: "背景",
    type: "Backgrounds",
    value: Backgrounds,
    x: 0,
    y: 0,
  },
  { hint: "头轮廓", type: "Header", value: Header, x: 400, y: 0 },
  { hint: "眼镜", type: "Glasses", value: Glasses, x: 400, y: 0 },
  { hint: "帽子", type: "Caps", value: Caps, x: 400, y: 0 },
  { hint: "衣服", type: "Clothes", value: Clothes, x: 400, y: 0 },
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
let k = 1;
function run() {
  console.log("Robot Mask Start ...");
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

  console.log("results.length", results);

  // wirte result to file
  fs.writeFile(
    path.resolve(__dirname, "../db/results.json"),
    JSON.stringify(results),
    function (err: any) {
      if (err) {
        throw err;
      }
    }
  );

  // compare img
  let db: any = {};
  for (let j = 1; j <= results.length; j++) {
    k++;
    let i = j - 1;
    let attributes: any = [];
    let instance = results[i].split("|");
    if (k < SS) {
      if (instance.filter((v: string) => Number(v) > 2).length > 0) {
        continue;
      }
    } else if (k < S) {
      if (instance.filter((v: string) => Number(v) < 3).length != 3) {
        continue;
      }
    } else {
      if (k < A) {
        break;
      }
    }
    // i. 0 <= k < 2  稀有性 SSS
    // ii. 2 <= k < 2+16  稀有性 SS  2^4
    // iii. 2+16 <= k < 2+16+64  稀有性 S   2^3*8
    // iiii. 2+16+64 <= k < 2+16+64+2918  稀有性 S   2^3*8
    console.log("k:", k);
    console.log("instance:", instance);
    let robatInstance = images(
      `${inputPath}/${types[0].type}/${instance[0]}.png`
    )
      .size(1600)
      .draw(images(`${inputPath}/${types[1].type}/${instance[1]}.png`), 0, 0)
      .draw(images(`${inputPath}/${types[2].type}/${instance[2]}.png`), 0, 0)
      .draw(images(`${inputPath}/${types[3].type}/${instance[3]}.png`), 0, 0)
      .draw(images(`${inputPath}/${types[4].type}/${instance[4]}.png`), 0, 0)
      .save(`${outputPath}/${k}.png`, {
        quality: 90,
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
    db[k] = {
      name: `Kasiar #${k}`,
      description: "Kasiar",
      image: `https://karsier.kaco.finance/karsier/image/${k}.png`,
      attributes: attributes,
    };
    fs.writeFile(
      path.resolve(__dirname, `../karsier/${k}.json`),
      JSON.stringify(db[k]),
      function (err: any) {
        if (err) {
          throw err;
        }
        console.log("File writing succeeded");
      }
    );
    // console.log("Genetic information：", db[k]);
    robatInstance = undefined;
  }
  fs.writeFile(
    path.resolve(__dirname, "../db/config.json"),
    JSON.stringify(db),
    function (err: any) {
      if (err) {
        throw err;
      }
      console.log("File writing succeeded");
    }
  );
}

run();
