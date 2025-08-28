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
    item: "lg:top-[calc(38%_-_23px)] lg:left-[calc(50%_-_23px)] md:top-[calc(38%_-_18px)] md:left-[calc(50%_-_18px)] top-[calc(50%_-_12px)] left-[calc(60%_-_12px)]",
    card: "md:top-[calc(38%_-_165px)] bottom-[calc(50%_+_24px)] md:left-[calc(50%_+_32px)] left-[calc(3%_+_70px)]",
  },
  {
    item: "lg:top-[calc(15%_-_23px)] lg:left-[calc(80%_-_23px)] md:top-[calc(15%_-_18px)] md:left-[calc(80%_-_18px)] top-[calc(80%_-_12px)] left-[calc(85%_-_12px)]",
    card: "md:top-[5%] md:right-[calc(20%_+_32px)] top-[calc(70%_-_165px)] right-[calc(15%_+_24px)]",
  },
  {
    item: "lg:top-[calc(45%_-_23px)] lg:left-[calc(17%_-_23px)] md:top-[calc(48%_-_18px)] md:left-[calc(18%_-_18px)] top-[calc(18%_-_12px)] left-[calc(55%_-_12px)]",
    card: "md:top-[calc(45%_-_165px)] md:left-[calc(17%_+_32px)] left-[calc(50%_-_110px)] top-[calc(18%_+_24px)]",
  },
  {
    item: "lg:top-[calc(63%_-_23px)] lg:left-[calc(83%_-_23px)] md:top-[calc(63%_-_18px)] md:left-[calc(83%_-_18px)] top-[calc(83%_-_12px)] left-[calc(35%_-_12px)]",
    card: "md:top-[calc(63%_-_165px)] bottom-[calc(17%_+_24px)] md:left-[calc(83%_-_253px)] left-[calc(50%_-_110px)]",
  },
  {
    item: "lg:top-[calc(68%_-_23px)] lg:left-[calc(19%_-_23px)] md:top-[calc(68%_-_18px)] md:left-[calc(19%_-_18px)] top-[calc(19%_-_12px)] left-[calc(32%_-_12px)]",
    card: "md:top-[calc(68%_-_165px)] top-[calc(19%_+_24px)] md:left-[calc(19%_+_32px)] left-[calc(5%)]",
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
