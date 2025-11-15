import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { memo, type FC } from "react";

interface Props {
  onSearch?: (value: string) => void;
  placeholderSearch?: string;
  search?: string;
  withButton?: boolean;
  autoFocus?: boolean;
}

export const Search: FC<Props> = memo(
  ({
    onSearch = () => {},
    placeholderSearch = "Search ...",
    search = "",
    withButton = true,
    autoFocus = false,
  }) => {
    return (
      <div className="w-full flex flex-col md:flex-row items-center gap-2">
        <Input
          placeholder={placeholderSearch}
          defaultValue={search}
          autoFocus={autoFocus}
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
        {withButton && (
          <Button className="w-full md:w-auto">
            Search
            <SearchIcon />
          </Button>
        )}
      </div>
    );
  },
);
