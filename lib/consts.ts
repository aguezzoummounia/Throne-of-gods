const dev_url = process.env.NEXT_PUBLIC_SITE_NAME || "";
const site_name = process.env.NEXT_PUBLIC_SITE_NAME || "";
const trailer_url = process.env.NEXT_PUBLIC_YOUTUBE_TRAILER || "";
const email_address = process.env.NEXT_PUBLIC_EMAIL_ADDRESS || "";
const chanel_handler = process.env.NEXT_PUBLIC_YOUTUBE_HANDLE || "";

const power_item_positions = [
  {
    item: "top-0 lg:left-[30%] md:left-[15%] left-0",
  },
  {
    item: "md:top-[30%] top-[25.5%] xl:right-[10%] right-0",
  },
  {
    item: "lg:top-[45%] top-[51.5%] xl:left-[10%] left-0",
  },
  {
    item: "bottom-0 lg:right-[30%] md:right-[15%] right-0",
  },
];

const map_locations_positions = [
  {
    // index 0
    item: "md:top-[3%] top-[3%] md:left-[30%] left-[3%]",
    card: "md:top-[3%] -top-10 md:left-[calc(30%_+_185px)] left-[calc(3%_+_70px)]",
  },
];

export {
  dev_url,
  site_name,
  trailer_url,
  email_address,
  chanel_handler,
  power_item_positions,
  map_locations_positions,
};
