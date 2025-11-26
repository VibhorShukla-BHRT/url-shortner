import express, { Application, Request, Response } from "express";
import cors from 'cors';
import dotenv from 'dotenv'
import { AppDataSource } from "./data-source";
import { decode_url, shorten_url } from "./services/shorten";
dotenv.config();
const app: Application = express();  
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());
app.get('/',(req: Request, res: Response)=>{
    return res.send('gello');
})
app.get('/:code',async (req: Request, res: Response)=>{
    const code = req.params.code;
    const orz_url = await decode_url(code);
    if(!orz_url) return res.status(404).json({
        'message': 'Url mapping does not exist',
        'ok': false
    });
    res.redirect(orz_url);
});
app.post('/shorten',async (req: Request, res: Response)=>{
    let {url} = req.body; // body : {'url': 'www.google.com'}
    if(!url){
        return res.status(400).json({
            'message': 'URL is required',
            ok: false
        });
    }
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    const code = await shorten_url(url);

    //building new link
    const protocol =  req.protocol;
    const host = req.get('host');
    const fullurl = `${protocol}://${host}/${code}`;
    return res.status(201).json({
        'message': 'Done!',
        'short_url': fullurl,
        'ok': true
    });
})
AppDataSource.initialize().then(()=>{
    console.log("DB connected!");
    app.listen(PORT, ()=>{
        console.log('Port listening at PORT: ', PORT);
    });
}).catch((err)=>{
    console.error("Error during Data Source initialization", err);
})
