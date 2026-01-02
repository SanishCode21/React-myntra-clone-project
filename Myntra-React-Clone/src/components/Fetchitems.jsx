import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { itemsActions } from "../store/itemsSlice";
import { fetchStatusActions } from "../store/fetchStatusSlice";

const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone) return;

    const controller = new AbortController();

    const fetchItems = async () => {
      try {
        dispatch(fetchStatusActions.markFetchingStarted());

        const res = await fetch("http://localhost:8080/items", {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();

        dispatch(itemsActions.addInitialItems(data.items[0]));
        dispatch(fetchStatusActions.markFetchDone());
        dispatch(fetchStatusActions.markFetchingFinished());
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
        }
      }
    };

    fetchItems();

    return () => controller.abort();
  }, [fetchStatus.fetchDone, dispatch]);

  return null;
};

export default FetchItems;
