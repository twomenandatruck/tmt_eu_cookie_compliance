# TMT EU Cookie Compliance

This module exists as a custom layer on top of EU Cookie Compliance that adds GPC compliance and easy user-based toggling of all cookie consents without need for an intrusive banner. Implicit consent is the default behavior.

## Versions

### 1.x
Baseline version of the module. Logic for managing cookie consents from a simple checkbox block. Compatible with Drupal 9 and Drupal 10 sites that have not switched to the new implementation of `core/once`. Only for use on Drupal 9+ sites with legacy JS implementations.

### 2.x
Adds GPC compliance and Drupal `core/once` JS compatibility. Deprecated for Drupal 11 sites as of 3.x.

### 3.x
Adds a page + controller for standardized display of the cookie management page + block. Standard install for all new Drupal 11 sites.
