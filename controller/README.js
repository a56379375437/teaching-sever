import { getREADMEModel } from "../model/README.js";

export const getREADME = async (ctx) => {
  try {
    console.log("getREADME");
    const readmeContent = await getREADMEModel();
    ctx.body = readmeContent;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error.message;
  }
};
