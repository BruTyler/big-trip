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
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const DefaultValues = {
  POINT_ID: 0,
  SORT_TYPE: SortType.EVENT,
  FILTER_TYPE: FilterType.EVERYTHING,
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
