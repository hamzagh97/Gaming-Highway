import { Container } from "@/components/ui/Container";
import { BrowseNav } from "./BrowseNav";
import { HeaderActions } from "./HeaderActions";
import { Logo } from "./Logo";
import { MobileMenuButton } from "./MobileMenuButton";
import { SearchBox } from "./SearchBox";

export function Header() {
  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <div className="bg-surface">
        <Container className="flex h-16 items-center gap-2 lg:h-[4.5rem] lg:gap-6">
          <MobileMenuButton />
          <Logo />
          <SearchBox className="hidden flex-1 md:block" />
          <HeaderActions className="ml-auto" />
        </Container>
        <Container className="pb-3 md:hidden">
          <SearchBox />
        </Container>
      </div>
      <BrowseNav />
    </header>
  );
}
