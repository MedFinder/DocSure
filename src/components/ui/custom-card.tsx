import React from "react";

const CustomCard = ({
  //   more = false,
  title,
  amount,
  bgColor,
  textColor,
}: {
  //   more?: boolean;
  title: string;
  amount: string;
  bgColor?: string;
  textColor: string;
}) => {
  return (
    <div className="rounded-[16px] py-[24px] px-[20px] flex flex-col gap-6 items-start md:w-[400px] bg-white border border-[#F2F3F5] shadowTwo shadow-lg">
      <div
        className="py-[8px] px-[12px] rounded-[16px]"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <h3 className="text-[16px] font-[500] leading-[normal]">{title}</h3>
      </div>
      <h1 className="text-[25px] font-[500] leading-[normal] whitespace-nowrap pl-2">
        {amount}
      </h1>
      {/* {more && (
        <div className="py-[2px] px-[3px] rounded-[10px] bg-[#FBFBF9] cursor-pointer">
          <h1 className="text-[12px] font-[500] leading-[normal]">View all</h1>
        </div>
      )} */}
    </div>
  );
};

export default CustomCard;
