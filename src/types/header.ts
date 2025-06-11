export type HeaderMenuType = {
  title: string;
  href?: string;
  items: {
      name: string;
      href: string;
  }[];
}

export type HeaderSingleItemType = {
  name: string;
  href: string;
  target?: string;
}
    