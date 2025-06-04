

const MainWrapper = ({ children }) => {
  return (
    <div className="relative pb-40 bg-transparent dark:bg-transparent overflow-hidden">
      {children}
    </div>
  );
};

export default MainWrapper;
