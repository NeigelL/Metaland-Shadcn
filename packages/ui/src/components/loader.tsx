const Loader = ({isFormLoading = true}) => {
  return (
    <div className={"flex " + (isFormLoading ? "" : "h-screen" ) + " items-center justify-center bg-white dark:bg-black"}>
      <div className="h-4 w-4 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loader;
