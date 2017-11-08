library(readr)
library(haven)
library(dplyr)
library(tidyr)
library(stringr)
library(ggplot2)
library(readxl)
library(jsonlite)

h16 <- read_excel('../../DATA/h1b/H-1B_Disclosure_Data_FY16.xlsx') 
h16 <- filter(h16, CASE_STATUS == "CERTIFIED" & WAGE_UNIT_OF_PAY =="Year")

h16_sub <- select(h16, c("CASE_NUMBER", "VISA_CLASS", "EMPLOYER_NAME", "EMPLOYER_STATE", "NAIC_CODE", "PREVAILING_WAGE"))


naic <- read_excel('../../DATA/ISIC_4_to_2017_NAICS.xlsx')
naic <- select(naic, c("2017\r\nNAICS\r\nUS", "2017 NAICS US TITLE"))
naic <- plyr::rename(naic, c("2017\r\nNAICS\r\nUS" = "NAIC_CODE", "2017 NAICS US TITLE" ="NAIC_CODE_TITLE"))
naic <- unique(naic)

set.seed(2)
h16_spl <- h16_sub[sample(1:nrow(h16_sub), 200, replace=FALSE),]
h16_spl$NAIC_CODE <- as.numeric(h16_spl$NAIC_CODE)

h16_spl <- left_join(h16_spl, naic)
h16_spl <- h16_spl[complete.cases(h16_spl[ , -1]),]

h16_fnl <- select(h16_spl, c("CASE_NUMBER", "PREVAILING_WAGE", "NAIC_CODE_TITLE"))
h16_fnl_2 <- h16_fnl %>%
  group_by(NAIC_CODE_TITLE) %>%
  summarise(MED_PW = median(PREVAILING_WAGE), TOTAL = n())
h16_fnl_2$MED_PW <- round(h16_fnl_2$MED_PW)

h16_csv <- write.csv(h16_fnl_2, file = "h1b_final.csv")
h16_fnl_3 <- read_csv('h1b_final.csv') 


h16_json <- toJSON(h16_fnl_3, pretty = TRUE)
write(h16_json, "negative.json")

