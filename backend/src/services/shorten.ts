import { AppDataSource } from "../data-source";
import { LAST, URL_ENTRY } from "../entity/URL_ENTRY";
const mp: string[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

//critical section
async function next_perm(): Promise<string>{
    return await AppDataSource.transaction(async (transactionalEntityManager)=>{
        // const lastrepo = AppDataSource.getRepository(LAST);
        let entity = await transactionalEntityManager.findOne(LAST,{
            where: {id: 1},
            lock: {mode: "pessimistic_write"}
        });
        if(!entity){
            entity = new LAST();
            entity.id = 1;
            entity.last = [0,0,0,0,0,0];
            await transactionalEntityManager.save(entity);
        }
        let arr=entity.last;
        for(let i=0;i<6;i++){
            arr[i] = (arr[i]+1)%62;
            if(arr[i]) break;
        }
        let res: string="";
        for(let i=0;i<6;i++){
            res+= mp[arr[i]];
        }
        entity.last = arr;
        await transactionalEntityManager.save(entity);
        return res;
    });
}
//encoder
export async function shorten_url(url: string): Promise<string>{
    const url_short = AppDataSource.getRepository(URL_ENTRY);
    const shrt: string = await next_perm();
    const newMap = new URL_ENTRY();
    newMap.surl = shrt;
    newMap.ourl = url;
    await url_short.save(newMap);
    return shrt;
}

//decoder--> recieve the short 6 figure code and then redirect the user automatically to the website
export async function decode_url(code: string): Promise<string | null>{
    const entity = AppDataSource.getRepository(URL_ENTRY);
    const durl = await entity.findOneBy({surl: code});
    if(!durl) return null;
    return durl.ourl;
}