"use client";
import { useSound } from "@/context/sound-context";

const SoundToggle: React.FC = () => {
  const { isSoundEnabled, toggleSound } = useSound();
  return (
    <button
      type="button"
      title="toggle sound"
      onClick={toggleSound}
      className="py-0.5 px-1 cursor-pointer"
    >
      {isSoundEnabled ? (
        <svg
          id="a"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 21 13"
          className="w-6 h-6 on"
          data-v-75c58159=""
        >
          <path
            d="M7.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5Z"
            style={{ fill: "#8F7E77", fillRule: "evenodd" }}
            data-v-75c58159=""
          >
            <animate
              data-v-75c58159=""
              attributeName="d"
              dur="0.8s"
              repeatCount="indefinite"
              values="M7.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5Z;
                        M7.5,2c.83,0,1.5.67,1.5,1.5v6c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5v-6c0-.83.67-1.5,1.5-1.5Z;
                        M7.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5Z"
            ></animate>
          </path>
          <path
            d="M1.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5C0,.67.67,0,1.5,0Z"
            style={{ fill: "#8F7E77", fillRule: "evenodd" }}
            data-v-75c58159=""
          >
            <animate
              data-v-75c58159=""
              attributeName="d"
              dur="1.2s"
              repeatCount="indefinite"
              values="M1.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5C0,.67.67,0,1.5,0Z;
                        M1.5,4c.83,0,1.5.67,1.5,1.5v2c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5v-2C0,4.67.67,4,1.5,4Z;
                        M1.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5C0,.67.67,0,1.5,0Z"
            ></animate>
          </path>
          <path
            d="M13.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5Z"
            style={{ fill: "#8F7E77", fillRule: "evenodd" }}
            data-v-75c58159=""
          >
            <animate
              data-v-75c58159=""
              attributeName="d"
              dur="0.9s"
              repeatCount="indefinite"
              values="M13.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5Z;
                        M13.5,3c.83,0,1.5.67,1.5,1.5v4c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5v-4c0-.83.67-1.5,1.5-1.5Z;
                        M13.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5Z"
            ></animate>
          </path>
          <path
            d="M19.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5Z"
            style={{ fill: "#8F7E77", fillRule: "evenodd" }}
            data-v-75c58159=""
          >
            <animate
              data-v-75c58159=""
              attributeName="d"
              dur="1.1s"
              repeatCount="indefinite"
              values="M19.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5Z;
                        M19.5,1c.83,0,1.5.67,1.5,1.5v8c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5v-8c0-.83.67-1.5,1.5-1.5Z;
                        M19.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5Z"
            ></animate>
          </path>
        </svg>
      ) : (
        <svg
          id="a"
          viewBox="0 0 21 13"
          data-v-75c58159=""
          className="w-6 h-6 off"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5Z"
            style={{
              fill: "#8F7E77",
              fillRule: "evenodd",
              opacity: "0.5",
            }}
            data-v-75c58159=""
          ></path>
          <path
            d="M1.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5C0,.67.67,0,1.5,0Z"
            style={{
              fill: "#8F7E77",
              fillRule: "evenodd",
              opacity: "0.5",
            }}
            data-v-75c58159=""
          ></path>
          <path
            d="M13.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5Z"
            style={{
              fill: "#8F7E77",
              fillRule: "evenodd",
              opacity: "0.5",
            }}
            data-v-75c58159=""
          ></path>
          <path
            d="M19.5,0c.83,0,1.5.67,1.5,1.5v10c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5V1.5c0-.83.67-1.5,1.5-1.5Z"
            style={{
              fill: "#8F7E77",
              fillRule: "evenodd",
              opacity: "0.5",
            }}
            data-v-75c58159=""
          ></path>
          <path
            data-v-75c58159=""
            d="M7.5,8c.83,0,1.5.67,1.5,1.5v2c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5v-2c0-.83.67-1.5,1.5-1.5Z"
            style={{ fill: "#8F7E77", fillRule: "evenodd" }}
          ></path>
          <path
            data-v-75c58159=""
            d="M1.5,8c.83,0,1.5.67,1.5,1.5v2c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5v-2c0-.83.67-1.5,1.5-1.5Z"
            style={{ fill: "#8F7E77", fillRule: "evenodd" }}
          ></path>
          <path
            data-v-75c58159=""
            d="M13.5,8c.83,0,1.5.67,1.5,1.5v2c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5v-2c0-.83.67-1.5,1.5-1.5Z"
            style={{ fill: "#8F7E77", fillRule: "evenodd" }}
          ></path>
          <path
            data-v-75c58159=""
            d="M19.5,8c.83,0,1.5.67,1.5,1.5v2c0,.83-.67,1.5-1.5,1.5s-1.5-.67-1.5-1.5v-2c0-.83.67-1.5,1.5-1.5Z"
            style={{ fill: "#8F7E77", fillRule: "evenodd" }}
          ></path>
        </svg>
      )}
    </button>
  );
};

export default SoundToggle;
