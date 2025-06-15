const SubHeadingBtn = (props: any) => {
    const { text, classes } = props;
    return (
        <button className={`${classes} p-1 rounded-full flex text items-center`}>
            <i className="las la-arrow-right p-2 rounded-full bg-primary text-white"></i>
            <span className=" font-medium sm:font-semibold px-2 sm:px-3 md:px-4">
        {text}
      </span>
        </button>
    );
};

export default SubHeadingBtn;