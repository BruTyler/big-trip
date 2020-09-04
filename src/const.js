export const MoveType = {
  TAXI: `taxi`,
  BUS: `bus`,
  TRAIN: `train`,
  SHIP: `ship`,
  TRANSPORT: `transport`,
  DRIVE: `drive`,
  FLIGHT: `flight`,
};

export const ActivityType = {
  CHECK_IN: `check-in`,
  SIGHTSEEING: `sightseeing`,
  RESTAURANT: `restaurant`,
};

export const EventType = Object.assign({}, MoveType, ActivityType);

export const PretextType = {
  MOVE: `to`,
  ACTIVITY: `in`,
};

export const BuisnessRequirements = {
  MAX_VISIBLE_OFFERS_PER_POINT: 3,
};

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const RenderPosition = {
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
};

export const PointMode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
};

export const TabNavItem = {
  TABLE: `tasks`,
  STATS: `stats`
};

export const TabAdditionalItem = {
  ADD_NEW_EVENT: `ADD_NEW_EVENT`,
};

export const MenuItem = Object.assign({}, TabNavItem, TabAdditionalItem);

export const ModelType = {
  DESTINATIONS: `Destinations`,
  FILTER: `Filter`,
  OFFERS: `Offers`,
  MENU: `Menu`,
  POINTS: `Points`,
  POINT_NEW: `PointNew`,
};

export const DefaultValues = {
  POINT_ID: 0,
  SORT_TYPE: SortType.EVENT,
  FILTER_TYPE: FilterType.EVERYTHING,
  MAIN_NAV: TabNavItem.TABLE,
};
