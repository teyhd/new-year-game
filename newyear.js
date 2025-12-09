import {mlog} from './vendor/logs.mjs'
process.on('uncaughtException', (err) => {
mlog('Глобальный косяк приложения!!! ', err.stack);
}); //Если все пошло по ***, спасет ситуацию

import express from 'express'
import exphbs from 'express-handlebars'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url';

var PORT = process.env.PORT || 91;

const app = express();
const hbs = exphbs.create({
defaultLayout: 'main',
extname: 'hbs',
helpers: {
    OK: function(){
    i_count = 1
    },
    I_C: function (opts){
    let anso = ''
    for (let i = 0; i < i_count; i++) {
        anso = anso + "I"
    }
    i_count++
    return anso
    },
    PLS: function (a,opts){

        return a+10
        },
    if_eq: function (a, b, opts) {
        if (a == b){ // Or === depending on your needs
            // logman.log(opts);
            return opts.fn(this);
        } else
            return opts.inverse(this);
    },
    if_more: function (a, b, opts) {
    if (a >= b){ // Or === depending on your needs
        // logman.log(opts);
        return opts.fn(this);
        } else
        return opts.inverse(this);
    },
    for: function(from, to, incr, block) {
        var accum = '';
        for(var i = from; i < to; i += incr)
            accum += block.fn(i);
        return accum;
    }
}
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export let appDir = __dirname;

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

const viewsPath = path.join(appDir, 'views');
const publicPath = path.join(appDir, 'public');

app.set('views', viewsPath);
mlog(publicPath);
app.use(express.static(publicPath));

app.use(cookieParser());
app.set('trust proxy', 1);

app.use(session({name: 'sso.sid',resave:true,saveUninitialized:false, secret: 'hardcode_secret_teyhd', cookie: 
  {secure: false, // ⚠️ обязательно false на HTTP!
  httpOnly: true}
}))

app.get('/',async (req,res)=>{
    res.render('index',{
      title: 'Новый год'
    });
  })

app.get('/compare',async (req,res)=>{
    res.render('index2',{
      title: 'Сравнение изображений'
    });
  })

// API endpoint для получения процента сходства
app.get('/prz',async (req,res)=>{
    // Генерируем случайный процент (50-100%)
    // Можешь заменить на реальный анализ изображений
    const percentage = Math.floor(Math.random() * 91) + 10;
    mlog('Запрос /prz - возвращаем процент сходства:', percentage);
    res.json({ percentage });
  })

async function start(){
    try {
        app.listen(PORT,()=> {
            mlog('Новый год - запущен')
           // say('Распределительный портал - запущен \nПорт: '+PORT)
            mlog('Порт:',PORT);
        })
    } catch (e) {
        mlog(e);
    }
}
start();