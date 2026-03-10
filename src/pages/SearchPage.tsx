import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SearchPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <Search className="size-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">Search</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Search across your chats and content. This page can be extended with a
          search input and results.
        </p>
      </div>
      <Button variant="outline" onClick={() => navigate("/app")}>
        Back to chats
      </Button>
    </div>
  );
}
