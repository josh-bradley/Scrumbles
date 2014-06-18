var Handlebars;
describe('templates', function(){
    var sandbox, page;

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
        Handlebars = {compile: function(){}};
        page = Scrumbles.pageProvider.getPage();
        sandbox.stub(Scrumbles.pageProvider, "getPage").returns(page);
    });

    afterEach(function(){
        sandbox.restore();
    });

    describe('getEmptyCardSlotTemplate', function(){
        it('should compile the emptyCardSlot template', function(){
            var spy =  sandbox.spy(Handlebars, 'compile');
            page.templates.$emptyCardSlot = { html: function() { return 'template';}};
            Scrumbles.templates.getEmptyCardSlotTemplate();

            expect(spy.calledWith('template')).toBe(true);
        });

        it('should return result of compile', function(){
            var expected = 'content';
            sandbox.stub(Handlebars, 'compile').returns(expected);
            page.templates.$card = { html: function() { return 'template';}};

            var actual = Scrumbles.templates.getEmptyCardSlotTemplate();

            expect(actual).toBe(expected);
        });

        it('should not compile template if already compiled', function(){
            var spy =  sandbox.spy(Handlebars, 'compile');
            page.templates.$card = { html: function() { return 'template';}};
            Scrumbles.templates.getEmptyCardSlotTemplate();

            Scrumbles.templates.getEmptyCardSlotTemplate();

            expect(spy.callCount < 1).toBe(true);
        });
    });
});