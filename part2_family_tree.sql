-- Create table to store people's data, including their personal information, gender, and family connections
CREATE TABLE People (
  Person_Id INT PRIMARY KEY,
  Personal_Name TEXT,
  Family_Name TEXT,
  Gender ENUM('Male', 'Female'),   
  Father_Id INT,
  Mother_Id INT,
  Spouse_Id INT
);

-- Insert data into the 'People' table
INSERT INTO People (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES 
(1, 'Yossi', 'Cohen', 'Male', NULL, NULL, 2),
(2, 'Dina', 'Cohen', 'Female', NULL, NULL, 1),
(3, 'Ron', 'Cohen', 'Male', 1, 2, NULL),
(4, 'Noa', 'Cohen', 'Female', 1, 2, NULL),
(5, 'Shira', 'Cohen', 'Female', 1, 2, NULL),
(6, 'Guy', 'Levi', 'Male', NULL, NULL, 4);

SELECT * FROM People;

-- Create table to store relatives' connections
CREATE TABLE Relatives (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type VARCHAR(20)
);

-- Father
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Father_Id, 'Father'
FROM People
WHERE Father_Id IS NOT NULL;

-- Mother
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Mother_Id, 'Mother'
FROM People
WHERE Mother_Id IS NOT NULL;

-- Children from father's side
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT Father_Id, Person_Id,
       CASE Gender WHEN 'Male' THEN 'Son' ELSE 'Daughter' END
FROM People
WHERE Father_Id IS NOT NULL;

-- Children from mother's side
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT Mother_Id, Person_Id,
       CASE Gender WHEN 'Male' THEN 'Son' ELSE 'Daughter' END
FROM People
WHERE Mother_Id IS NOT NULL;

-- Spouse
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Spouse_Id,
       CASE Gender WHEN 'Male' THEN 'Wife' ELSE 'Husband' END
FROM People
WHERE Spouse_Id IS NOT NULL;

-- Siblings via shared father
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id, p2.Person_Id,
       CASE p2.Gender WHEN 'Male' THEN 'Brother' ELSE 'Sister' END
FROM People p1
JOIN People p2 ON p1.Father_Id = p2.Father_Id
WHERE p1.Person_Id <> p2.Person_Id AND p1.Father_Id IS NOT NULL;

-- Siblings via shared mother
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id, p2.Person_Id,
       CASE p2.Gender WHEN 'Male' THEN 'Brother' ELSE 'Sister' END
FROM People p1
JOIN People p2 ON p1.Mother_Id = p2.Mother_Id
WHERE p1.Person_Id <> p2.Person_Id AND p1.Mother_Id IS NOT NULL;

-- Disable Safe Updates to allow update of spouse links
SET SQL_SAFE_UPDATES = 0;

-- Task 2: Update missing spouse connections.
UPDATE People p1
JOIN People p2 ON p1.Spouse_Id = p2.Person_Id
SET p2.Spouse_Id = p1.Person_Id
WHERE p2.Spouse_Id IS NULL 
  AND p1.Spouse_Id IS NOT NULL
  AND p2.Person_Id IS NOT NULL; 

-- Re-enable Safe Updates after the update
SET SQL_SAFE_UPDATES = 1;

SELECT * FROM Relatives;
