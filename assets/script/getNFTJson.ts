const cheerio = require("cheerio");
const _fs = require("fs");
const _path = require("path");

const got = require("got");
// 0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07  pancake
// 0x8f0528ce5ef7b51152a59745befdd91d97091d2f  Alpaca
(async () => {
  let resultAlpaca = [];
  let resultKKACO = [];
  for (let i = 1; i < 1000000; i++) {
    console.log(i);
    // https://graphigo.prd.galaxy.eco/metadata/0x46F36F9FE211600417D9d24c014a154052ABC960/
    // https://graphigo.prd.galaxy.eco/metadata/0x46F36F9FE211600417D9d24c014a154052ABC960/1.json
    try {
      const responseKACO = await got(
        `https://graphigo.prd.galaxy.eco/metadata/0x46F36F9FE211600417D9d24c014a154052ABC960/${i}.json`
      );
      const responseAlpaca = await got(
        `https://graphigo.prd.galaxy.eco/metadata/0xe85d7B8f4c0C13806E158a1c9D7Dcb33140cdc46/${i}.json`
      );
      const _$ = cheerio.load(responseKACO.body);
      const $ = cheerio.load(responseAlpaca.body);
      resultKKACO.push(
        `${_$.html()}`
          .replace("<html><head></head><body>", "")
          .replace("</body></html>", "")
      );

      resultAlpaca.push(
        `${$.html()}`
          .replace("<html><head></head><body>", "")
          .replace("</body></html>", "")
      );
    } catch (error: any) {
      console.log(error);
      continue;
    }
  }
  _fs.writeFile(
    _path.resolve(__dirname, "../db/NFTKKACOJson.json"),
    JSON.stringify(resultKKACO),
    function (err: any) {
      if (err) {
        throw err;
      }
    }
  );
  _fs.writeFile(
    _path.resolve(__dirname, "../db/NFTAlpacaJson.json"),
    _path.stringify(resultAlpaca),
    function (err: any) {
      if (err) {
        throw err;
      }
    }
  );
})();
