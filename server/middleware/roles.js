export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  WAITER: 'waiter',
  CHEF: 'chef',
  CUSTOMER: 'customer',
};

export const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.MANAGER];
export const KITCHEN_ROLES = [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.CHEF];
export const FLOOR_STAFF = [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.WAITER];
export const ALL_STAFF = [...ADMIN_ROLES, ROLES.WAITER, ROLES.CHEF];
