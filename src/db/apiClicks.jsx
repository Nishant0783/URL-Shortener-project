import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

export async function getClicksForUrls(urlIds) {
    const { data, error } = await supabase
        .from("clicks")
        .select("*")
        .in("url_id", urlIds);

    if (error){ 
        console.error(error.message)
        throw new Error("unable to load Clicks")
    };
    return data;
}

export async function getClicksForUrl(url_id) {
    const {data, error} = await supabase
      .from("clicks")
      .select("*")
      .eq("url_id", url_id);
  
    if (error) {
      console.error(error);
      throw new Error("Unable to load Stats");
    }
  
    return data;
  }

const parser = new UAParser();
export const storeClicks = async ({ id, originalUrl }) => {
    try {
        const res = parser.getResult();
        const device = res.type || "desktop";

        const response = await fetch("https://ipapi.co/json");
        // console.log("Resposne is: ", response.json())
        const { city, country_name: country } = await response.json();

        const {data, error} = await supabase.from("clicks").insert({
            url_id: id,
            city: city,
            country: country,
            device: device,
        },
    );

        if(data) {
            console.log("Data is: ", data)
        }

        if(error) {
            console.log("Error is: ", error)
        }

        window.location.href = originalUrl;
    } catch (error) {
        console.error("Error recording click:", error);
    }
}