import { ListFilter } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Card, CardContent, CardFooter } from "../ui/card";

export const Filter = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ListFilter className="h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-0">
        <Card className="p-1 border-none rounded-none gap-1">
          <CardContent className="p-0 bg-transparent"></CardContent>
          <CardFooter className="flex justify-between items-center p-0">
            <Button variant={"outline"} size={"sm"} onClick={() => {}}>
              Reset
            </Button>
            <Button size={"sm"} onClick={() => {}}>
              Apply
            </Button>
          </CardFooter>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
