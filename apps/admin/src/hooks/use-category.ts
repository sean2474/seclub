import { getCategories } from "@/lib/action/category";
import { useEffect, useState } from "react";
import { toast } from "./use-toast";

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await getCategories();
      if (error) {
        toast({
          title: "에러",
          description: error,
          variant: "destructive",
        });
        return;
      }
      if (data && data.length > 0) {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  return {
    categories,
    setCategories
  }
}