export type Locale = "de" | "en" | "fr";

export type Messages = {
  header: {
    home: string;
    catalog: string;
    reviews: string;
    contacts: string;
    cart: string;
    search: string;
    brandLabel: string;
    profile: string;
  };
  search: {
    placeholder: string;
    submit: string;
    ariaSearch: string;
    ariaInput: string;
    resultsTitle: string;
    found: string;
    result: string;
    results: string;
    for: string;
    searching: string;
    emptyQuery: string;
    emptyQueryDescription: string;
    noResults: string;
    noResultsDescription: string;
  };
  catalog: {
    title: string;
    newest: string;
    topRated: string;
    noProducts: string;
    previous: string;
    next: string;
    previousPage: string;
    nextPage: string;
    paginationAria: string;
    showing: string;
    of: string;
    sortLabel: string;
    product: string;
    products: string;
    page: string;
  };
  home: {
    pageTitle: string;
    welcomeTitle: string;
    welcomeDescription: string;
    newestTitle: string;
    newestDescription: string;
    topRatedTitle: string;
    topRatedDescription: string;
    viewAll: string;
    noProducts: string;
  };
  product: {
    noImage: string;
    inStock: string;
    outOfStock: string;
    addToCart: string;
  };
  auth: {
    createAccount: string;
    createAccountDescription: string;
    name: string;
    namePlaceholder: string;
    nameMinLength: string;
    birth: string;
    birthPlaceholder: string;
    birthRequired: string;
    birthFormat: string;
    email: string;
    emailPlaceholder: string;
    emailInvalid: string;
    emailExists: string;
    password: string;
    passwordPlaceholder: string;
    passwordMinLength: string;
    register: string;
    registering: string;
    validationError: string;
    registrationFailed: string;
    alreadyHaveAccount: string;
    signIn: string;
    signInDescription: string;
    signingIn: string;
    passwordRequired: string;
    invalidCredentials: string;
    loginFailed: string;
    dontHaveAccount: string;
    logout: string;
  };
  review: {
    reviews: string;
    writeReview: string;
    nameLabel: string;
    namePlaceholder: string;
    nameRequired: string;
    ratingLabel: string;
    starsRequired: string;
    textLabel: string;
    textPlaceholder: string;
    textRequired: string;
    textMinLength: string;
    submit: string;
    submitting: string;
    noReviews: string;
    unauthorized: string;
    validationError: string;
    submitError: string;
    productNotFound: string;
    filterByRating: string;
    all: string;
    loading: string;
    review: string;
    page: string;
    noReviewsWithFilter: string;
  };
};

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];
