Feature: Places
  The POIs (Points Of Interest) are represented as places shown
  on a map. Every person should be able to add places to the system in order
  to make it more content-rich and usable.

  Scenario: Person adds a place
    Given I have logged in
    And I am on the add place page
    When I enter the place information
    And I press "Save"
    Then I should see "You successfully added a place to zaPOI!"

  Scenario: Person adds a place skipping required fields
    Given I have logged in
    And I am on the add place page
    When I press "Save"
    Then I should see "The name field is required."
    And I should see "The address field is required."
    And I should see "The categories field is required."