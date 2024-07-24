import express from "express";
import { Client } from "@notionhq/client";
import bodyParser from "body-parser";


const DATABASE_ID = process.env.DATABASE_ID;
const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN;

const app = express();
app.use(bodyParser.json());

let pages;

const notion = new Client({
   auth: NOTION_API_TOKEN
});

async function getNotionData() {
   try {
      const results = await notion.databases.query({
         database_id: DATABASE_ID,
      })
      //Aqui lo que se quiera hacer con las paginas de la base de datos
      return results;

   } catch (error) {
      console.log(error);
   }
}

async function addNotionPageToDatabase(databaseId, pageProperties) {
   const newPage = await notion.pages.create({
      parent: {
         database_id: databaseId,
      },
      properties: pageProperties,
   })
   console.log(newPage);
}

app.get("/", (req, res) => {
   res.send("Welcome to Voice to Notion Integration api");
});

app.get("/pages", (req, res) => {
   getNotionData()
      .then(val => {
         res.json(val.results);
         pages = val.results;
         pages.forEach(page => {
            console.log(page.properties.Texto.title[0].plain_text);
         })
      });
})

app.post("/save", (req, res) => {
   const body = req.body;
   addNotionPageToDatabase(DATABASE_ID, body);
   res.send("Recibido");
});

app.listen(3000, () => {
   console.log("Server listening on port 3000");
});

