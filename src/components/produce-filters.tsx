'use client';

import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';

interface ProduceFiltersProps {
  tags: string[];
  maxPrice: number;
  priceRange: number[];
  onPriceChange: (value: number[]) => void;
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export function ProduceFilters({
  tags,
  maxPrice,
  priceRange,
  onPriceChange,
  selectedTags,
  onSelectedTagsChange,
  searchTerm,
  onSearchTermChange,
}: ProduceFiltersProps) {
  const handleTagChange = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onSelectedTagsChange(newTags);
  };

  return (
    <div className="space-y-6 px-3">
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Price Range</Label>
          <span className="text-sm font-medium text-accent-foreground">
            ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
          </span>
        </div>
        <Slider
          min={0}
          max={maxPrice}
          step={1}
          value={priceRange}
          onValueChange={onPriceChange}
          className="[&>span:first-child]:h-5 [&>span:first-child]:w-5"
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="space-y-2">
          {tags.map((tag, index) => (
            <div key={`${tag}-${index}`} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag}-${index}`}
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => handleTagChange(tag)}
              />
              <Label
                htmlFor={`tag-${tag}-${index}`}
                className="capitalize font-normal text-sm"
              >
                {tag}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
