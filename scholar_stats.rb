require 'open-uri'
require 'nokogiri'

module Jekyll
  class ScholarStats < Generator
    # Replace `SCHOLAR_ID` with your own Google Scholar ID
    SCHOLAR_ID = 'XXXXXXXXXX'.freeze
    SCHOLAR_URL = 'http://scholar.google.com/citations?hl=en&user='.freeze
    def generate(site)
      doc = Nokogiri::HTML(URI.parse(SCHOLAR_URL + SCHOLAR_ID).open)
      tbl = doc.css('table').first
      tbl_data = { 'id' => SCHOLAR_ID }
      tbl.css('tr')[1..].each do |tr|
        cell_data = tr.css('td').map(&:text)
        tbl_data[cell_data[0].downcase.sub('-', '_')] = cell_data[1].to_i
      end
      site.data['scholar'] = tbl_data
    end
  end
end
