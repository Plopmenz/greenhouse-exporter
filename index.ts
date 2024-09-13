import axios from "axios";
import { config } from "dotenv";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

async function fromStart() {
  let page = 1;
  const applications = [] as { id: number; attachments: { filename: string; url: string }[] }[];
  while (true) {
    const newApplications = await axios
      .get(`https://harvest.greenhouse.io/v1/applications?per_page=500&page=${page}&skip_count=true`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.API_KEY}:`).toString("base64")}`,
        },
      })
      .then((res) => res.data as { id: number; attachments: { filename: string; url: string }[] }[]);
    if (newApplications.length === 0) {
      break;
    } else {
      applications.push(...newApplications);
      page++;

      console.log(`Found ${newApplications.length} new applications, new total is ${applications.length}...`);
    }
  }
  await writeFile(join(".", "greenhouse.json"), JSON.stringify(applications));
  console.log("Finished collecting applications!");

  await mkdir(join(".", "applications"));
  fromApplication(0);
}

async function fromApplication(index: number) {
  console.log(`Resuming from application ${index}...`);
  const applications = JSON.parse(await readFile(join(".", "greenhouse.json"), { encoding: "utf-8" })) as {
    id: number;
    attachments: { filename: string; url: string }[];
  }[];

  for (let i = index; i < applications.length; i++) {
    console.log(`Processing application ${i + 1}/${applications.length}`);

    const application = applications[i];
    await mkdir(join(".", "applications", application.id.toString()));
    let success = false;
    while (!success) {
      try {
        await Promise.all(
          application.attachments.map(async (attachment) => {
            const fileContent = await axios.get(attachment.url, { responseType: "arraybuffer" }).then((res) => Buffer.from(res.data, "binary"));
            await writeFile(join(".", "applications", application.id.toString(), attachment.filename), fileContent);
          })
        );
        success = true;
      } catch (err) {
        console.error(err);
      }
    }
  }
}

config();
fromStart().catch(console.error);
// fromApplication(0).catch(console.error);
