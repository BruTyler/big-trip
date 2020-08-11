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

export const DefaultValues = {
  POINT_ID: 0,
};

export const SortType = {
  EVENT: `event`,
  PRICE: `price`,
  TIME: `time`,
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
