"use client";

import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { createExchangeRates } from "./actions";

export default function RefreshExchangeRate() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  async function onClick() {
    setIsLoading(true);
    const result = await createExchangeRates();
    if (result.status) {
      toast({
        title: "Refreshed Rates",
        description: `Refreshed rates successfully.`,
      });

      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "An error occured!",
        description: result.message,
      });
    }
    setIsLoading(false);
  }

  return (
    <Button variant="default" onClick={onClick} disabled={isLoading}>
      {isLoading ? (
        <RefreshCwIcon className="animate-spin" />
      ) : (
        <>
          <RefreshCwIcon className="h-4 w-4 lg:mr-2" />
          <span className="hidden lg:block">Refresh Rates</span>
        </>
      )}
    </Button>
  );
}
