import { useState, useEffect, useCallback } from "react";

interface Props {
  data: Record<string, any>;
}

const useWindowClickTracker = (props?: Props) => {
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [uniqueClicks, setUniqueClicks] = useState<number>(0);
  // Check if the user has already clicked (for unique click tracking)
  const hasClicked = (): boolean => {
    return sessionStorage.getItem("hasClicked") === "true";
  };

  // Mark the user as having clicked
  const markAsClicked = (): void => {
    sessionStorage.setItem("hasClicked", "true");
  };

  const trackClicks = async (totalClicks: number, uniqueClicks: number) => {
    try {
      await fetch("/api/handler", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalClicks,
          uniqueClicks,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = useCallback(async () => {
    setTotalClicks((prevTotalClicks) => prevTotalClicks + 1);

    if (!hasClicked()) {
      setUniqueClicks((prevUniqueClicks) => prevUniqueClicks + 1);
      markAsClicked();
    }
    await trackClicks(totalClicks + 1, uniqueClicks + 1);
  }, [totalClicks, uniqueClicks]);

  useEffect(() => {
    if (props) {
      setTotalClicks(props.data?.totalClicks || 0);
      setUniqueClicks(props.data?.uniqueClicks || 0);
    }
  }, []);

  useEffect(() => {
    // Add event listener for window click
    window.addEventListener("click", handleClick);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  return { totalClicks, uniqueClicks };
};

export default useWindowClickTracker;
