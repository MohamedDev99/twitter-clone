const SidebarLink = ({ Icon, text, active }) => {
    return (
        <div
            className={` text-[#d9d9d9] text-xl flex items-center justify-center xl:justify-start
            hoverAnimation space-x-3 ${active && "font-bold"}`}>
            <Icon className="h-7 text-white" />
            <span className="hidden xl:inline">{text}</span>
        </div>
    );
};

export default SidebarLink;
