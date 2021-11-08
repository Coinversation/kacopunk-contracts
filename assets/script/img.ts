/**
 * Nodejs Picture synthesis script
 * - npm init
 * - npm install images
 * - jpeg images support compression, png not
 */
const images = require("images");
const fs = require("fs");
const path = require("path");

const Backgrounds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const Caps = ["1", "2"];
const Clothes = ["1", "2"];
const Glasses = ["1", "2"];
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
const outputPath = path.resolve(__dirname, "../output/");
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
    let i = j - 1;
    let attributes: any = [];
    let instance = results[i].split("|");
    console.log("instance:", instance);
    let robatInstance = images(
      `${inputPath}/${types[0].type}/${instance[0]}.png`
    )
      .size(1600)
      .draw(images(`${inputPath}/${types[1].type}/${instance[1]}.png`), 0, 0)
      .draw(images(`${inputPath}/${types[2].type}/${instance[2]}.png`), 0, 0)
      .draw(images(`${inputPath}/${types[3].type}/${instance[3]}.png`), 0, 0)
      .draw(images(`${inputPath}/${types[4].type}/${instance[4]}.png`), 0, 0)
      .save(`${outputPath}/${i}.png`, {
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
    db[i] = {
      name: i,
      attributes: attributes,
    };
    console.log("Genetic information：", db[i]);
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
