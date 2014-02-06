Feature: Registration
  Every person should be able to register in order to use all
  the features of the system

  Scenario: User registers
    Given I am on the register page
    When I enter the required information
    And I press "Register"
    Then I should be authenticated

  Scenario: Invalid email address
    Given I am on the register page
    When I fill in an invalid email address
    And I press "Register"
    Then I should see "Please enter a valid email address."

  Scenario: Non-matching passwords
    Given I am on the register page
    When I fill in two different passwords
    And I press "Register"
    Then I should see "Passwords don't match."

  Scenario: Skipping required fields
    Given I am on the register page
    And I press "Register"
    Then I should see "The email address field is required."
    And I should see "The display name field is required."
    And I should see "The password field is required."

  Scenario: Violating field size limitations
    Given I am on the register page
    When I fill in a display name shorter than 3 characters
    And I fill in a password shorter than 6 characters
    And I press "Register"
    Then I should see "The name field must be at least 3 characters."
    And I should see "The password field must be at least 6 characters."