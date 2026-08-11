import {createClient} from "@redis/client"
export const Client = createClient({
    url:"redis://localhost:6379"
});

Client.on("error", (err) =>{
    console.log(err?.message)
})
await Client.connect();
console.log("Connected");