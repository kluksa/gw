import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBenefit, Benefit } from '../benefit.model';

import { BenefitService } from './benefit.service';

describe('Service Tests', () => {
  describe('Benefit Service', () => {
    let service: BenefitService;
    let httpMock: HttpTestingController;
    let elemDefault: IBenefit;
    let expectedResult: IBenefit | IBenefit[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BenefitService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        type: 'AAAAAAA',
        effectiveDate: currentDate,
        value: 0,
        endDate: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            effectiveDate: currentDate.format(DATE_FORMAT),
            endDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Benefit', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            effectiveDate: currentDate.format(DATE_FORMAT),
            endDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            effectiveDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Benefit()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Benefit', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            type: 'BBBBBB',
            effectiveDate: currentDate.format(DATE_FORMAT),
            value: 1,
            endDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            effectiveDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Benefit', () => {
        const patchObject = Object.assign(
          {
            type: 'BBBBBB',
          },
          new Benefit()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            effectiveDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Benefit', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            type: 'BBBBBB',
            effectiveDate: currentDate.format(DATE_FORMAT),
            value: 1,
            endDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            effectiveDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Benefit', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBenefitToCollectionIfMissing', () => {
        it('should add a Benefit to an empty array', () => {
          const benefit: IBenefit = { id: 123 };
          expectedResult = service.addBenefitToCollectionIfMissing([], benefit);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(benefit);
        });

        it('should not add a Benefit to an array that contains it', () => {
          const benefit: IBenefit = { id: 123 };
          const benefitCollection: IBenefit[] = [
            {
              ...benefit,
            },
            { id: 456 },
          ];
          expectedResult = service.addBenefitToCollectionIfMissing(benefitCollection, benefit);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Benefit to an array that doesn't contain it", () => {
          const benefit: IBenefit = { id: 123 };
          const benefitCollection: IBenefit[] = [{ id: 456 }];
          expectedResult = service.addBenefitToCollectionIfMissing(benefitCollection, benefit);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(benefit);
        });

        it('should add only unique Benefit to an array', () => {
          const benefitArray: IBenefit[] = [{ id: 123 }, { id: 456 }, { id: 35040 }];
          const benefitCollection: IBenefit[] = [{ id: 123 }];
          expectedResult = service.addBenefitToCollectionIfMissing(benefitCollection, ...benefitArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const benefit: IBenefit = { id: 123 };
          const benefit2: IBenefit = { id: 456 };
          expectedResult = service.addBenefitToCollectionIfMissing([], benefit, benefit2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(benefit);
          expect(expectedResult).toContain(benefit2);
        });

        it('should accept null and undefined values', () => {
          const benefit: IBenefit = { id: 123 };
          expectedResult = service.addBenefitToCollectionIfMissing([], null, benefit, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(benefit);
        });

        it('should return initial array if no Benefit is added', () => {
          const benefitCollection: IBenefit[] = [{ id: 123 }];
          expectedResult = service.addBenefitToCollectionIfMissing(benefitCollection, undefined, null);
          expect(expectedResult).toEqual(benefitCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
