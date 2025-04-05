import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
    // Policy data
    const policies = [
        {
            icon: assets.exchange_icon,
            title: "Exchange Policy",
            description:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto tempore rerum quia quaerat voluptatibus ut, accusantium incidunt.",
        },
        {
            icon: assets.quality_icon,
            title: "Quality Assurance",
            description:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto tempore rerum quia quaerat voluptatibus ut, accusantium incidunt.",
        },
        {
            icon: assets.support_img,
            title: "24/7 Support",
            description:
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto tempore rerum quia quaerat voluptatibus ut, accusantium incidunt.",
        },
    ];

    return (
        <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-12 text-center py-2">
            {policies.map((policy, index) => (
                <div
                    key={index}
                    className="hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                    <img
                        src={policy.icon}
                        className="w-12 m-auto mb-5"
                        alt={policy.title} // Meaningful alt text
                    />
                    <p className="font-semibold">{policy.title}</p>
                    <p className="text-gray-400">{policy.description}</p>
                </div>
            ))}
        </div>
    );
};

export default OurPolicy;