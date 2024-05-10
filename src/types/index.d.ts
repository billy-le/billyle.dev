declare module "remark-sectionize";

interface Window {
  plausible: any;
  REMARK42: any;
  remark_config: {
    host: string;
    site_id?: string;
    url?: string;
    components?: ("embed" | "last-comments" | "counter")[];
    max_shown_comments?: number;
    max_last_comments?: number;
    theme?: "light" | "dark";
    page_title?: string;
    locale?:
      | "en"
      | "be"
      | "bp"
      | "bg"
      | "zh"
      | "fi"
      | "fr"
      | "de"
      | "ja"
      | "ko"
      | "pl"
      | "ru"
      | "es"
      | "tr"
      | "ua"
      | "it"
      | "vi";
    show_email_subscription?: boolean;
    show_rss_subscription?: boolean;
    simple_view?: boolean;
    no_footer?: boolean;
    __colors__?: Record<string, string>;
    styles?: Partial<
      Record<
        keyof Omit<
          CSSStyleDeclaration,
          | "length"
          | "parentRule"
          | "setProperty"
          | "removeProperty"
          | "item"
          | "getPropertyValue"
          | "getPropertyPriority"
        >,
        string | number
      >
    >;
  };
}
